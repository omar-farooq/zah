<?php

namespace App\Http\Controllers;

use App\Models\PaidRent;
use App\Models\Purchase;
use App\Models\RecurringPayment;
use App\Models\Rent;
use App\Models\RentArrear;
use App\Models\TreasuryItem;
use App\Models\TreasuryReport;
use App\Services\TreasuryService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreasuryReportController extends Controller
{
    /**
     * Instantiate Treasury Service
     *
     */
    public function __construct() {
        $this->treasuryService = new TreasuryService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TreasuryReport $treasuryReport, Request $request)
    {
        if(isset($request->getReports) && $request->getReports === 'true') {
            return response()->json(
                $treasuryReport->orderBy('created_at', 'desc')->paginate(10)
            );
        }

        if(isset($request->find) && $request->find == 'sourceOrRecipient') {
            return $this->treasuryService->getSourceOrRecipient($request);
        }

        return Inertia::render('Treasury/Reports/index', [
            'title' => 'Treasury Report',
            'reportPage1' => TreasuryReport::orderBy('created_at', 'desc')->paginate(10)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $arrears = new RentArrear;
        return Inertia::render('Treasury/Reports/Create', [
            'title' => 'Create Treasury Report',
            'rents' => Rent::with('user')->get(),
            'arrears' => $arrears->currentTenant()->get(),
            'previousReport' => TreasuryReport::latest()->first(),
            'recurringPayments' => RecurringPayment::all(),
            'unreported' => TreasuryItem::where('treasury_report_id', NULL)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(isset($request->treasurable) && $request->treasurable == 'recurring') {
            $this->treasuryService->payRecurring($request);
        }
        else if(isset($request->treasurable) && $request->treasurable == 'unreported') {
            $this->treasuryService->addReceipt($request->receipt, $request->model, $request->modelId);
        } else {
            return response()->json($this->treasuryService->createReport($request));
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function show(TreasuryReport $treasuryReport)
    {

        $treasuryItems = TreasuryItem::where('treasury_report_id', $treasuryReport->id)->get();
        $rents = PaidRent::where('treasury_report_id', $treasuryReport->id)
                        ->with('user')
                        ->get();
        if($treasuryReport->id > 1) {
            $previousBudget = TreasuryReport::where('id', $treasuryReport->id - 1)->first()->remaining_budget;
        } else {
            $previousBudget = 0;
        }

        return Inertia::render('Treasury/Reports/View', [
            'title' => 'View Treasury Report',
            'report' => $treasuryReport,
            'rents' => $rents,
            'treasuryItems' => $treasuryItems,
            'previousBudget' => $previousBudget
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function edit(TreasuryReport $treasuryReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TreasuryReport $treasuryReport)
    {
        //
    }

    /*
     * Display the summary page for the treasury
     *
     */
    public function summary()
    {
        $currentYearPurchaseCount = Purchase::where('purchased', 1)
                                        ->where('created_at', '>', Carbon::now()->subYear())
                                        ->count();

        $previousYearPurchaseCount = Purchase::where('purchased', 1)
                                         ->whereBetween('created_at', [Carbon::now()->subYears(2), Carbon::now()->subYear()])
                                         ->count();

        $currentSpending = TreasuryItem::where('is_incoming', 0)
                                        ->where('created_at', '>', Carbon::now()->subYear())
                                        ->pluck('amount')
                                        ->sum();

        $previousYearSpending = TreasuryItem::where('is_incoming', 0)
                                            ->whereBetween('created_at', [Carbon::now()->subYears(2), Carbon::now()->subYear()])
                                            ->pluck('amount')
                                            ->sum();

        return Inertia::render('Treasury/Summary', [
            'title' => 'Treasury Summary',
            'currentYearPurchaseCount' => $currentYearPurchaseCount,
            'previousYearPurchaseCount' => $previousYearPurchaseCount,
            'currentBalance' => TreasuryReport::latest()->first()->remaining_budget,
            'previousYearBalance' => TreasuryReport::where('start_date', '<', Carbon::now()->subYear())->first()->remaining_budget,
            'currentSpending' => $currentSpending,
            'previousYearSpending' => $previousYearSpending
        ]);
    }

    /*
     * Get Original Model from Treasury Item
     *
     */
    public function treasurableModel($id) {        
        return response()->json(TreasuryItem::find($id)->treasurable);
    }
}
