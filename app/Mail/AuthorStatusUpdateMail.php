<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AuthorStatusUpdateMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Submission $submission,
        public string $oldStatus,
        public string $newStatus,
        public ?string $note = null
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Paper Status Update [{$this->submission->paper_id}] - {$this->newStatus}",
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
        $authorName = $author ? $author->full_name : ($this->submission->user ? $this->submission->user->name : 'Author');
        $journalTitle = $this->submission->journal ? $this->submission->journal->journal_title : 'Academic Journal';
        $updatedDate = now()->format('d F Y, h:i A');

        $noteBlock = $this->note ? "
            <div style='margin-top: 15px; padding: 12px; background-color: #f1f5f9; border-left: 4px solid #1e3a8a; border-radius: 4px;'>
                <p style='margin: 0; font-size: 13px; font-weight: bold; color: #334155;'>Editor's Note / Comments:</p>
                <p style='margin: 5px 0 0 0; font-size: 14px; color: #1e293b; white-space: pre-line;'>".e($this->note)."</p>
            </div>
        " : "";

        return "
        <div style='font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
            <div style='background-color: #1e3a8a; color: #ffffff; padding: 16px; border-radius: 6px; text-align: center;'>
                <h2 style='margin: 0;'>Paper Status Updated</h2>
            </div>
            <div style='padding: 20px 0;'>
                <p>Dear <strong>{$authorName}</strong>,</p>
                <p>The status of your paper submitted to <strong>".e($journalTitle)."</strong> has been updated.</p>

                <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Paper ID:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1e3a8a;'>{$this->submission->paper_id}</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Journal:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>".e($journalTitle)."</td>
                    </tr>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Paper Title:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>".e($this->submission->title)."</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>New Status:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'><span style='background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: bold;'>".e($this->newStatus)."</span></td>
                    </tr>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Updated Date:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$updatedDate}</td>
                    </tr>
                </table>

                {$noteBlock}

                <p style='margin-top: 20px;'>If you have any questions or require further assistance, please contact the editorial office.</p>
                <p>Best regards,<br/>Editorial Office<br/>".e($journalTitle)."</p>
            </div>
        </div>
        ";
    }
}
