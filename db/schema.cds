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
      gameId:String;
      lines      : LargeString @title : 'Lines';
      categories : Association to Categories @title : 'Categories';
      finished: Boolean;
      username: String;

      @Core.MediaType: mediaType
      content : LargeBinary ;

      @Core.IsMediaType: true
      mediaType : String;
      fileName : String;
      applicationName:String; 
 
 
}

entity Guesses : cuid, managed {
      gameId:String;
      guidid:String;
      categories : Association to Categories @title : 'Categories';
      finished: Boolean;
      username: String;
      answer: String;
      right1 :String;
      fileName: String;
      applicationName: String;  
}

