<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function index(Task $task, Request $request)
    {
        if ($request->has('index')) {
            if ($request->has('getCompleted')) {
                return response()->json($task->where('completed', 1)->paginate(10));
            } else {
                return Inertia::render('House/Tasks', [
                    'title' => 'Tasks',
                    'completedTasksPageOne' => $task->where('completed', 1)->paginate(10),
                ]);
            }
        } else {

            //Get the completed/non-completed tasks if queried
            $completed = $request->get('completed');
            $id = $request->get('id');
            $user_id = $request->get('user_id');
            $query = Task::query();
            if ($completed) {
                $query->where('completed', $completed);
            }

            //get tasks by id
            if ($id) {
                $query->where('id', $id);
            }

            //return the task with the results of the query and with the user relationship
            //If a user id is set then return only those where the user has a task
            if (isset($user_id)) {
                $results = $query->whereHas('users', function ($q) use ($user_id) {
                    $q->where('id', $user_id);
                })->get();
            } else {
                $results = $query->with('users')->get();
            }

            //return a JSON response
            return response()->json([
                'tasks' => $results,
            ]);
        }
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
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
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
