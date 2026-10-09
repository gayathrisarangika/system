<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AuthorSubmissionConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Submission $submission)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Paper Submission Confirmation [{$this->submission->paper_id}] - {$this->submission->journal->journal_title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtmlContent(),
        );
    }

    private function buildHtmlContent(): string
    {
        $author = $this->submission->correspondingAuthor();
        $authorName = $author ? $author->full_name : $this->submission->user->name;
        $submittedDate = $this->submission->submitted_at ? $this->submission->submitted_at->format('d F Y, h:i A') : now()->format('d F Y, h:i A');

        return "
        <div style='font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;'>
            <div style='background-color: #1e3a8a; color: #ffffff; padding: 16px; border-radius: 6px; text-align: center;'>
                <h2 style='margin: 0;'>Paper Submission Successful</h2>
            </div>
            <div style='padding: 20px 0;'>
                <p>Dear <strong>{$authorName}</strong>,</p>
                <p>Thank you for submitting your paper to <strong>{$this->submission->journal->journal_title}</strong>. We have successfully received your manuscript and accompanying documents.</p>
                
                <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Paper ID:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1e3a8a;'>{$this->submission->paper_id}</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Journal:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$this->submission->journal->journal_title}</td>
                    </tr>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Paper Title:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$this->submission->title}</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Submission Date/Time:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$submittedDate}</td>
                    </tr>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Status:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'><span style='background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: bold;'>{$this->submission->status}</span></td>
                    </tr>
                </table>

                <p>You can track the status of your submission by logging into your account dashboard.</p>
                <p>Best regards,<br/>Editorial Office<br/>{$this->submission->journal->journal_title}</p>
            </div>
        </div>
        ";
    }
}
