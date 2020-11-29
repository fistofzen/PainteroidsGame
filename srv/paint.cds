using {sap.ui.paint as my} from '../db/schema';

service paintService{

  entity Categories
  as projection on my.Categories;

  entity Drawings
  as projection on my.Drawings;

  action submitDrawing(Drawing : Drawings) returns Drawings.ID;

  
  
}