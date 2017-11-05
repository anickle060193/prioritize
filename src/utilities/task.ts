import * as uuid from 'uuid';

const LOCAL_STORAGE_PREFIX = 'prioritize::';
const TASKS_KEY = LOCAL_STORAGE_PREFIX + 'tasks';

export default class Task
{
    public readonly name: string;
    public readonly description: string;
    private readonly id: string;

    static load( id: string )
    {
        let task = window.localStorage.getItem( LOCAL_STORAGE_PREFIX + id );
        if( task )
        {
            return JSON.parse( task ) as Task;
        }
        else
        {
            throw new Error( `Could not find task with id: "${id}"` );
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

    private static saveTasks( tasks: Task[] )
    {
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
        window.localStorage.setItem( this.storageId, JSON.stringify( this ) );
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
}