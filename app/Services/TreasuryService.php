<?php

namespace App\Services;

use App\Models\PaidRecurringPayment;
use App\Models\PaidRent;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\RecurringPayment;
use App\Models\RentArrear;
use App\Models\TreasuryItem;
use App\Models\TreasuryReport;
use Illuminate\Support\Facades\Storage;

class TreasuryService
{
    public function __construct()
    {
        $this->arrears = new RentArrear;
    }

    /**
     * Create a new report from the request
     * Add rent as a treasurable via the payRent function
     * Add the report ID to items that don't have it as they are now reported
     *
     * @param  array  $request
     * @return void
     */
    public function createReport($request)
    {
        $new_report = TreasuryReport::create($request->all());
        $new_report_id = $new_report->id;
        $this->payRent($new_report_id, $request->paid_rents);
        $this->updateArrears($request->arrears);
        $this->updateAccounts($new_report_id, $request->accounts_balances);
        $this->addReportIDToUnreported($new_report_id, $request->unreported);
        $this->linkAdditionalPaymentsToReport($new_report_id);

        return $new_report->id;
    }

    /**
     * Update the accounts
     *
     * @param  int  $report_id
     * @param  array  $accounts
     * @return void
     */
    protected function updateAccounts($report_id, $accounts)
    {
        $report = TreasuryReport::find($report_id);

        foreach ($accounts as $account) {
            $new_balance = $account['final'] ?? $account['calculated'];
            $report->accounts()->attach($account['id'], ['account_balance' => $new_balance]);
        }
    }

    /**
     * Add the rent to the database
     *
     * @param  int  $report_id
     * @param  array  $rents
     * @return void
     */
    protected function payRent($report_id, $rents)
    {
        foreach ($rents as $rent) {
            $rent['treasury_report_id'] = $report_id;
            $paid_rent = PaidRent::create($rent);

            $this->createTreasurable($report_id, 'App\\Models\\PaidRent', $paid_rent->id, true, $paid_rent->amount_paid);
        }
    }

    protected function updateArrears($newArrears)
    {
        foreach ($newArrears as $newArrear) {
            $arrear = $this->arrears->find($newArrear['id']);
            $arrear->amount = $newArrear['amount'];
            $arrear->save();
        }
    }

    /**
     * Add recurring payments to Treasury Items
     *
     * @param  int  $report_id
     * @param  array  $recurring
     * @return void
     */
    public function payRecurring($recurring)
    {
        $paid_recurring = new PaidRecurringPayment;
        $paid_recurring->treasury_report_id = $recurring->treasuryReportID;
        $paid_recurring->recurring_payment_id = $recurring->id;
        $paid_recurring->amount_paid = $recurring->amount ?? $recurring->uniqueAmount;
        $paid_recurring->save();

        //Upload receipt
        if (isset($recurring->receipt)) {
            $this->addReceipt($recurring->receipt, 'App\\Models\\PaidRecurringPayment', $paid_recurring->id);
        }

        //Create treasurable
        $this->createTreasurable($recurring->treasuryReportID, 'App\\Models\\PaidRecurringPayment', $paid_recurring->id, false, $recurring->amount ?? $recurring->uniqueAmount);
    }

    /**
     * Add Payments to the database
     *
     * @param  string  $payable_type
     * @param  int  $payable_id
     * @return void
     */
    public function addReceipt($file, $payable_type, $payable_id)
    {
        $receipt = new Receipt;
        $receiptName = date('Ymdhis').$file->getClientOriginalName();
        Storage::putFileAs('documents/receipts', $file, $receiptName);
        $receipt['receipt'] = $receiptName;
        $receipt['payable_type'] = $payable_type;
        $receipt['payable_id'] = $payable_id;
        $receipt->save();
    }

    /**
     * Create treasurable items
     * These are associated to the treasury report id
     * Everything accountable is added here.
     *
     * @param  int  $treasury_report_id
     * @param  string  $treasurable_type
     * @param  int  $treasurable_id
     * @param  bool  $is_incoming
     * @param  float  $amount
     */
    public function createTreasurable($treasury_report_id, $treasurable_type, $treasurable_id, $is_incoming, $amount)
    {
        $treasurable = new TreasuryItem;
        $treasurable->treasury_report_id = $treasury_report_id;
        $treasurable->is_incoming = $is_incoming;
        $treasurable->treasurable_type = $treasurable_type;
        $treasurable->treasurable_id = $treasurable_id;
        $treasurable->amount = $amount;
        $treasurable->save();
    }

    /*
     * Add the report ID to any treasury Item without the id as they are now accounted for
     *
     */
    protected function addReportIDToUnreported($treasury_report_id, $treasurables)
    {
        foreach ($treasurables as $treasurable) {
            TreasuryItem::where('id', $treasurable['id'])
                ->update(['treasury_report_id' => $treasury_report_id]);
        }
    }

    /*
     * Add the report ID to additional payments
     *
     */
    protected function linkAdditionalPaymentsToReport($treasury_report_id)
    {
        $payments = Payment::where('treasury_report_id', null)->get();

        foreach ($payments as $payment) {
            $this->createTreasurable($treasury_report_id, 'App\\Models\\Payment', $payment->id, $payment->incoming, $payment->amount);
        }

        Payment::where('treasury_report_id', null)
            ->update(['treasury_report_id' => $treasury_report_id]);

    }

    /*
     * Get the source/recipient of a payment
     * @param arr
     * @return string JSON
     *
     */
    public function getSourceOrRecipient($request)
    {
        $model = app($request->type);

        switch ($request->type) {
            case 'App\Models\PaidRecurringPayment':
                $recurringId = $model->where('id', $request->id)->first()->recurring_payment_id;
                $recipient = RecurringPayment::where('id', $recurringId)->first()->recipient;

                return response()->json($recipient);
                break;
            case 'App\Models\PaidRent':
                return response()->json('test');
            case 'App\Models\Payment':
                return response()->json($model->where('id', $request->id)->first()->name);
            case 'App\Models\Purchase':
                return response()->json('');
            case 'App\Models\Maintenance':
                return response()->json($model->where('id', $request->id)->first()->maintenanceRequest->contractor);
            default:
                return response()->json('');
        }

    }
}
