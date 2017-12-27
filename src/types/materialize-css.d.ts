interface DropdownOptions
{
  inDuration: number;
  outDuraction: number;
  constrainWidth: boolean;
  hover: boolean;
  gutter: number;
  belowOrigin: boolean;
  alignment: 'left' | 'right';
  stopPagination: boolean;
}

interface JQuery
{
  dropdown( method: 'open' | 'close' ): JQuery;
  dropdown( options?: Partial<DropdownOptions> ): JQuery;
}
