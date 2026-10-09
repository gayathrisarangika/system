<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OperatorSubmissionNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Submission $submission)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New Paper Submission Received [{$this->submission->paper_id}] - {$this->submission->journal->journal_title}",
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
        $authorEmail = $author ? $author->email : $this->submission->user->email;
        $submittedDate = $this->submission->submitted_at ? $this->submission->submitted_at->format('d F Y, h:i A') : now()->format('d F Y, h:i A');

        $filesList = '';
        foreach ($this->submission->files as $file) {
            $sizeMb = round($file->file_size / (1024 * 1024), 2);
            $filesList .= "<li><strong>" . ucfirst($file->document_type) . ":</strong> {$file->original_filename} ({$sizeMb} MB)</li>";
        }

        $dashboardUrl = url("/editor/submission/{$this->submission->id}");

        return "
        <div style='font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;'>
            <div style='background-color: #0f172a; color: #ffffff; padding: 16px; border-radius: 6px; text-align: center;'>
                <h2 style='margin: 0;'>New Paper Submission Alert</h2>
            </div>
            <div style='padding: 20px 0;'>
                <p>Hello Journal Operator,</p>
                <p>A new paper has been submitted to <strong>{$this->submission->journal->journal_title}</strong>.</p>

                <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Paper ID:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1e3a8a;'>{$this->submission->paper_id}</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Paper Title:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$this->submission->title}</td>
                    </tr>
                    <tr style='background-color: #f8fafc;'>
                        <td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>Corresponding Author:</td>
                        <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$authorName} ({$authorEmail})</td>
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

                <p><strong>Submitted Documents:</strong></p>
                <ul>
                    {$filesList}
                </ul>

                <div style='margin-top: 25px; text-align: center;'>
                    <a href='{$dashboardUrl}' style='background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>View Submission in Operator Dashboard</a>
                </div>
            </div>
        </div>
        ";
    }
}
