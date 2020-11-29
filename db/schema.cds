namespace sap.ui.paint;

using {
  managed,
  cuid
} from '@sap/cds/common';
 

entity Categories  {
    key Catid   : Integer;
    Name     : String(100);
    Language : String(2);
    Duration : Integer;
}


entity Drawings : cuid, managed {
    
      lines      : String @title : 'Lines';
      categories : Association to Categories @title : 'Categories';
 
}
