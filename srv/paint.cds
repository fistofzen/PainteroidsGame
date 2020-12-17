using {sap.ui.paint as my} from '../db/schema';

service paintService{

  entity Categories
  as projection on my.Categories;

  entity Drawings
  as projection on my.Drawings;
  entity Guesses
  as projection on my.Guesses;


  action submitDrawing(Drawing : Drawings) returns Drawings.ID;

  
  
}