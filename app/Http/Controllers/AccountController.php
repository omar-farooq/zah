<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\DefaultAccount;
use App\Models\TreasuryReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $latest_treasury_report = TreasuryReport::all()->last()->id;
        return Inertia::render('Treasury/Accounts/index', [
            'initialAccounts' => Account::with(["treasuryReports" => function($q) use($latest_treasury_report){
                $q->where('treasury_report_id', '=', $latest_treasury_report);
            }])->get(),
            'defaultAccounts' => DefaultAccount::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'account_name' => 'required|string',
            'bank' => 'required|string',
            'starting_balance' => 'required|numeric'
        ]);

        $new_account = Account::create($request->all());
        return $new_account;
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        $account->delete();
    }
}
