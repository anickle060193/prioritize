const PROJECT_HORIZONTAL_KEY = 'PROJECT_HORIZONTAL_KEY';

export default class Settings
{
  private constructor() { }

  static get projectHorizontal(): boolean
  {
    let item = localStorage.getItem( PROJECT_HORIZONTAL_KEY );
    if( item )
    {
      return JSON.parse( item );
    }
    else
    {
      return true;
    }
  }

  static set projectHorizontal( horizontal: boolean )
  {
    localStorage.setItem( PROJECT_HORIZONTAL_KEY, JSON.stringify( horizontal ) );
  }
}
