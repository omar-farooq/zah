<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\User;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param App\Models\Task $task
     * @param Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Task $task, Request $request)
    {
        //Get the completed/non-completed tasks if queried
        $completed = $request->get('completed');
        $id = $request->get('id');
        $query = Task::query();
        if($completed) {
            $query->where('completed', $completed);
        }

        //get tasks by id
        if($id) {
            $query->where('id', $id);
        }

        //return the task with the results of the query and with the user relationship
        $results = $query->with('users')->get();


        //return a JSON response
        return response()->json([
            'tasks' => $results
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newTask = Task::create($request->all());
        $assignees = User::find($request->users);
        $newTask->users()->attach($assignees);

        return response()->json([
            'id' => $newTask->id,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskRequest  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Task $task)
    {
        $task->completed = 1;
        $task->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Task::destroy($id);
    }
}
