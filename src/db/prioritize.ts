import Dexie from 'dexie';
import 'dexie-observable';

export class Task
{
    id: string;
    projectId: string;
    index: number;
    name: string;
    description: string;

    constructor( name: string, description: string, id?: string )
    {
        this.name = name;
        this.description = description;
        if( id )
        {
            this.id = id;
        }
    }

    async save()
    {
        this.id = await db.tasks.put( this );
        return this.id;
    }
}

export class Project
{
    id: string;
    name: string;
    description: string;
    tasks: Task[];

    constructor( name: string, description: string, id?: string )
    {
        this.name = name;
        this.description = description;
        if( id )
        {
            this.id = id;
        }
        this.tasks = [ ];

        Object.defineProperties( this, {
            tasks: { value: [ ], enumerable: false, writable: true }
        } );
    }

    async load()
    {
        this.tasks = await db.tasks.where( 'projectId' ).equals( this.id ).sortBy( 'index' );
    }

    async save()
    {
        return await db.transaction( 'rw', db.tasks, db.projects, async () => {
            this.id = await db.projects.put( this );

            let taskIds = await Promise.all( this.tasks.map( ( task, i ) =>
            {
                task.projectId = this.id;
                task.index = i;
                return task.save();
            } ) );

            await db.tasks.where( 'projectId' ).equals( this.id )
                .and( task => taskIds.indexOf( task.id ) === -1 )
                .delete();

            return this.id;
        } );
    }
}

class PrioritizeDatabase extends Dexie
{
    tasks: Dexie.Table<Task, string>;
    projects: Dexie.Table<Project, string>;

    constructor()
    {
        super( 'PrioritizeDatabase' );

        this.version( 1 ).stores( {
            tasks: '$$id, projectId, projectIndex, name, description',
            projects: '$$id, name, description'
        } );

        this.tasks.mapToClass( Task );
        this.projects.mapToClass( Project );
    }
}

const db = new PrioritizeDatabase();
export default db;