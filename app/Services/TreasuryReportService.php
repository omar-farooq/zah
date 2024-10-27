<?php

namespace App\Services;

use App\Models\PaidRent;
use App\Models\TreasuryItem;
use App\Models\TreasuryReport;

class TreasuryReportService
{
    public $rents;

    public $reports;

    public $report_ids;

    public $treasury_items;

    public $previous_budget;

    public $remaining_budget;

    public $calculated_remaining_budget;

    public $first_report_start;

    public $last_report_end;

    public function __construct($start_date, $end_date)
    {
        $this->reports = TreasuryReport::where('start_date', '>=', $start_date)
            ->where('end_date', '<=', $end_date)
            ->orderBy('start_date', 'asc')
            ->get();
        $this->report_ids = $this->filterIds($this->reports);
        $this->budgetDetails($this->reports, $start_date);
        $this->getDates($this->reports);
    }

    protected function filterIds($reports)
    {
        $this->report_ids = [];
        foreach ($reports as $report) {
            $this->report_ids[] .= $report->id;
        }
        $this->getTreasuryItems($this->report_ids);
        $this->getRents($this->report_ids);
    }

    protected function getTreasuryItems($report_ids)
    {
        $this->treasury_items = TreasuryItem::whereIn('treasury_report_id', $report_ids)->get();
    }

    protected function getRents($report_ids)
    {
        $this->rents = PaidRent::whereIn('treasury_report_id', $report_ids)->with('user')->get();
    }

    protected function budgetDetails($reports, $start_date)
    {
        $this->remaining_budget = $reports->last()->remaining_budget;
        $this->calculated_remaining_budget = $reports->last()->calculated_remaining_budget;
        $previousReportId = $reports->first()->id;
        $this->previous_budget = TreasuryReport::where('id', $previousReportId - 1)->first()->remaining_budget ?? \App\Models\Account::where('created_at', '<=', $start_date)->sum('starting_balance');
    }

    protected function getDates($reports)
    {
        $this->first_report_start = $reports->first()->start_date;
        $this->last_report_end = $reports->last()->end_date;
    }
}
