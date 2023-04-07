<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactForm extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
    protected $name, $email, $comments;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email, $comments)
    {
        $this->name = $name;
        $this->email = $email;
        $this->comments = $comments;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Message from the Contact Form',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contacted',
            with: [
                'name' => $this->name,
                'email' => $this->email,
                'comments' => $this->comments
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
