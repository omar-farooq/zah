<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $message;

    protected $subject;

    protected $recipient;

    /**
     * Create a new job instance.
     */
    public function __construct($subject, $message, $recipient)
    {
        $this->subject = $subject;
        $this->message = $message;
        $this->recipient = $recipient;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->recipient['email'])->send(new NotificationMail($this->message, $this->subject, $this->recipient['name']));
    }
}
