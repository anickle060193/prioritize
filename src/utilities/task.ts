import * as uuid from 'uuid';

const LOCAL_STORAGE_PREFIX = 'prioritize::';
const TASKS_KEY = LOCAL_STORAGE_PREFIX + 'tasks';

export default class Task
{
    public readonly name: string;
    public readonly description: string;
    public readonly id: string;

    static load( taskId: string )
    {
        let task = window.localStorage.getItem( LOCAL_STORAGE_PREFIX + taskId );
        if( task )
        {
            let { name, description, id } = JSON.parse( task );
            if( id !== taskId )
            {
                throw new Error( `Task ID does not match parsed ID: "${taskId}" != "${id}"` );
            }
            return new Task( name, description, id );
        }
        else
        {
            throw new Error( `Could not find task with id: "${taskId}"` );
        }
    }

    static getTasks()
    {
        try
        {
            let taskIds = ( JSON.parse( window.localStorage.getItem( TASKS_KEY ) as string ) || [ ] ) as string[];
            return taskIds.map( Task.load );
        }
        catch
        {
            // Intentionally left blank
        }
        return [ ];
    }

    static saveTasks( tasks: Task[] )
    {
        tasks.forEach( ( task ) => task.saveTask() );
        window.localStorage.setItem( TASKS_KEY, JSON.stringify( tasks.map( task => task.id ) ) );
    }

    private get storageId()
    {
        return LOCAL_STORAGE_PREFIX + this.id;
    }

    constructor( name: string, description: string, id: string | null = null )
    {
        this.name = name;
        this.description = description;
        this.id = id || uuid.v4();
    }

    save()
    {
        this.saveTask();
        let tasks = Task.getTasks();
        if( tasks.findIndex( ( task ) => task.id === this.id ) === -1 )
        {
            tasks.splice( 0, 0, this );
            Task.saveTasks( tasks );
        }
    }

    delete()
    {
        let tasks = Task.getTasks();
        tasks = tasks.filter( ( task ) => task.id !== this.id );
        Task.saveTasks( tasks );
        window.localStorage.removeItem( this.storageId );
    }

    private saveTask()
    {
        window.localStorage.setItem( this.storageId, JSON.stringify( this ) );
    }
}