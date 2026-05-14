<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\JournalManagementController;
use App\Http\Controllers\ConferenceManagementController;
use App\Http\Controllers\SymposiumManagementController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/backend-login', [AuthController::class, 'showBackendSelector'])->name('backend.selector');
Route::get('/backend-selection', [AuthController::class, 'showDepartmentSelection'])->name('backend.selection');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/department', [DepartmentController::class, 'index'])->name('department');

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/journal/{journal}', [PublicController::class, 'journal'])->name('journal.view');
Route::get('/journal/{journal}/editorial-board', [PublicController::class, 'editorialBoard'])->name('journal.editorial_board');
Route::get('/journal/{journal}/current', [PublicController::class, 'journalCurrent'])->name('journal.current');
Route::get('/journal/{journal}/archive', [PublicController::class, 'journalArchive'])->name('journal.archive');
Route::get('/journal/{journal}/contact', [PublicController::class, 'journalContact'])->name('journal.contact');
Route::get('/article/{article}', [PublicController::class, 'article'])->name('article.view');
Route::get('/article/{article}/download', [PublicController::class, 'downloadArticle'])->name('article.download');
Route::get('/issue/{issue}/download', [PublicController::class, 'downloadIssue'])->name('issue.download');

Route::get('/conference/{conference}', [PublicController::class, 'conference'])->name('conference.view');
Route::get('/conference/{conference}/committee', [PublicController::class, 'conferenceCommittee'])->name('conference.committee');
Route::get('/conference/{conference}/current', [PublicController::class, 'conferenceCurrent'])->name('conference.current');
Route::get('/conference/{conference}/archive', [PublicController::class, 'conferenceArchive'])->name('conference.archive');
Route::get('/conference/{conference}/contact', [PublicController::class, 'conferenceContact'])->name('conference.contact');

Route::get('/symposium/{symposium}', [PublicController::class, 'symposium'])->name('symposium.view');
Route::get('/symposium/{symposium}/committee', [PublicController::class, 'symposiumCommittee'])->name('symposium.committee');
Route::get('/symposium/{symposium}/current', [PublicController::class, 'symposiumCurrent'])->name('symposium.current');
Route::get('/symposium/{symposium}/archive', [PublicController::class, 'symposiumArchive'])->name('symposium.archive');
Route::get('/symposium/{symposium}/contact', [PublicController::class, 'symposiumContact'])->name('symposium.contact');

Route::middleware('auth')->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::post('/admin/users', [DashboardController::class, 'storeUser'])->name('admin.users.store');
    Route::post('/admin/approve/journal/{journal}', [DashboardController::class, 'approveJournal'])->name('admin.approve.journal');
    Route::post('/admin/reject/journal/{journal}', [DashboardController::class, 'rejectJournal'])->name('admin.reject.journal');
    
    Route::post('/admin/approve/conference/{conference}', [DashboardController::class, 'approveConference'])->name('admin.approve.conference');
    Route::post('/admin/reject/conference/{conference}', [DashboardController::class, 'rejectConference'])->name('admin.reject.conference');
    
    Route::post('/admin/approve/symposium/{symposium}', [DashboardController::class, 'approveSymposium'])->name('admin.approve.symposium');
    Route::post('/admin/reject/symposium/{symposium}', [DashboardController::class, 'rejectSymposium'])->name('admin.reject.symposium');

    Route::prefix('editor')->group(function () {
        Route::get('/journal/dashboard', [DashboardController::class, 'editor']);
        Route::get('/conference/dashboard', [DashboardController::class, 'editor']);
        Route::get('/symposium/dashboard', [DashboardController::class, 'editor']);

        Route::get('/journal', [JournalManagementController::class, 'index'])->name('journal.index');
        Route::get('/journal/create', [JournalManagementController::class, 'create'])->name('journal.create');
        Route::post('/journal', [JournalManagementController::class, 'store'])->name('journal.store');
        Route::get('/journal/{journal}/edit', [JournalManagementController::class, 'edit'])->name('journal.edit');
        Route::put('/journal/{journal}', [JournalManagementController::class, 'update'])->name('journal.update');
        
        Route::get('/journal/{journal}/board', [JournalManagementController::class, 'manageBoard'])->name('journal.board');
        Route::post('/journal/{journal}/board', [JournalManagementController::class, 'storeBoardMember']);
        Route::delete('/journal/board/{member}', [JournalManagementController::class, 'deleteBoardMember']);
        
        Route::get('/journal/{journal}/issues', [JournalManagementController::class, 'manageIssues'])->name('journal.issues');
        Route::post('/journal/{journal}/issues', [JournalManagementController::class, 'storeIssue']);
        Route::post('/journal/issue/{issue}', [JournalManagementController::class, 'updateIssue'])->name('journal.issue.update');
        Route::delete('/journal/issue/{issue}', [JournalManagementController::class, 'deleteIssue'])->name('journal.issue.delete');
        
        Route::get('/journal/issue/{issue}/articles', [JournalManagementController::class, 'manageArticles'])->name('journal.articles');
        Route::post('/journal/issue/{issue}/articles', [JournalManagementController::class, 'storeArticle']);
        Route::post('/journal/article/{article}', [JournalManagementController::class, 'updateArticle'])->name('journal.article.update');

        // Conference
        Route::get('/conference', [ConferenceManagementController::class, 'index'])->name('conference.index');
        Route::get('/conference/create', [ConferenceManagementController::class, 'create'])->name('conference.create');
        Route::post('/conference', [ConferenceManagementController::class, 'store']);
        Route::get('/conference/{conference}/edit', [ConferenceManagementController::class, 'edit']);
        Route::put('/conference/{conference}', [ConferenceManagementController::class, 'update']);
        Route::get('/conference/{conference}/committee', [ConferenceManagementController::class, 'manageCommittee']);
        Route::post('/conference/{conference}/committee', [ConferenceManagementController::class, 'storeCommitteeMember']);
        Route::delete('/conference/committee/{member}', [ConferenceManagementController::class, 'deleteCommitteeMember']);
        Route::get('/conference/{conference}/abstract-books', [ConferenceManagementController::class, 'manageAbstractBooks'])->name('conference.abstract_books');
        Route::post('/conference/{conference}/abstract-books', [ConferenceManagementController::class, 'storeAbstractBook']);
        Route::post('/conference/abstract-book/{proceeding}', [ConferenceManagementController::class, 'updateAbstractBook']);
        Route::delete('/conference/abstract-book/{proceeding}', [ConferenceManagementController::class, 'deleteAbstractBook']);
        Route::get('/conference/abstract-book/{proceeding}/articles', [ConferenceManagementController::class, 'manageArticles'])->name('conference.articles');
        Route::post('/conference/abstract-book/{proceeding}/articles', [ConferenceManagementController::class, 'storeArticle']);
        Route::post('/conference/article/{article}', [ConferenceManagementController::class, 'updateArticle']);

        // Symposium
        Route::get('/symposium', [SymposiumManagementController::class, 'index'])->name('symposium.index');
        Route::get('/symposium/create', [SymposiumManagementController::class, 'create'])->name('symposium.create');
        Route::post('/symposium', [SymposiumManagementController::class, 'store']);
        Route::get('/symposium/{symposium}/edit', [SymposiumManagementController::class, 'edit']);
        Route::put('/symposium/{symposium}', [SymposiumManagementController::class, 'update']);
        Route::get('/symposium/{symposium}/committee', [SymposiumManagementController::class, 'manageCommittee']);
        Route::post('/symposium/{symposium}/committee', [SymposiumManagementController::class, 'storeCommitteeMember']);
        Route::delete('/symposium/committee/{member}', [SymposiumManagementController::class, 'deleteCommitteeMember']);
        Route::get('/symposium/{symposium}/abstract-books', [SymposiumManagementController::class, 'manageAbstractBooks'])->name('symposium.abstract_books');
        Route::post('/symposium/{symposium}/abstract-books', [SymposiumManagementController::class, 'storeAbstractBook']);
        Route::post('/symposium/abstract-book/{proceeding}', [SymposiumManagementController::class, 'updateAbstractBook']);
        Route::delete('/symposium/abstract-book/{proceeding}', [SymposiumManagementController::class, 'deleteAbstractBook']);
        Route::get('/symposium/abstract-book/{proceeding}/articles', [SymposiumManagementController::class, 'manageArticles'])->name('symposium.articles');
        Route::post('/symposium/abstract-book/{proceeding}/articles', [SymposiumManagementController::class, 'storeArticle']);
        Route::post('/symposium/article/{article}', [SymposiumManagementController::class, 'updateArticle']);
    });
});
