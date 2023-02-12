<?php

namespace App\Services;

use App\Models\PaidRent;
use App\Models\Payment;
use App\Models\TreasuryItem;
use App\Models\TreasuryReport;

class TreasuryService {
    
    /**
     * Create a new report from the request
     * 
     * @param array $request
     * @return void
     */
    public function createReport($request) 
    {
        $new_report = TreasuryReport::create($request->all());
        $new_report_id = $new_report->id;
        $this->payRent($new_report_id, $request->paid_rents);

        if(isset($request->payables)) {
            $this->makePayments($new_report_id, $request->payables);
        }
        return true;
    }

    /**
     * Add the rent to the database
     *
     * @param int $report_id
     * @param array $rents
     * @return void
     *
     */
    protected function payRent($report_id, $rents)
    {
        forEach($rents as $rent) {
            $rent['treasury_report_id'] = $report_id;
            $paid_rent = PaidRent::create($rent);
            
            $this->createTreasurable($report_id, "App\\Models\\PaidRent", $paid_rent->id, true, $paid_rent->amount_paid);
        }
    }

    /**
     * Add Payments to the database
     *
     * @param array $payments
     * @return void
     *
     */
    protected function makePayments($report_id, $payments) 
    {
        forEach($payments as $payment) {
            $new_payment = Payment::create($payment);
            $this->createTreasurable($report_id, 'App\\Models\\Payment', $new_payment->id, $payment['incoming'], $payment['amount']);
        }
    }

    /**
     * Create treasurable items
     * These are associated to the treasury report id
     * Everything accountable is added here.
     *
     * @param int $treasury_report_id
     * @param string $treasurable_type
     * @param int $treasurable_id
     * @param bool $is_incoming
     * @param double $amount
     *
     */
    protected function createTreasurable($treasury_report_id, $treasurable_type, $treasurable_id, $is_incoming, $amount)
    {
        $treasurable = new TreasuryItem;
        $treasurable->treasury_report_id = $treasury_report_id;
        $treasurable->is_incoming = $is_incoming;
        $treasurable->treasurable_type = $treasurable_type;
        $treasurable->treasurable_id = $treasurable_id;
        $treasurable->amount = $amount;
        $treasurable->save();
    }
}
