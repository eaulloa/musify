'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

 var Album = require('../models/album');
 var Artist = require('../models/artist');
 var Song = require('../models/song');

function getArtist(req, res){
    
    var artistId = req.params.id;
     Artist.findById(artistId, (err, artist)=>{
       if(err){
          res.status(500).send({message: 'Error en la peticion'});
         
       }else{
           if(!artist){
                res.status(404).send({message: 'No existe'});

           }else{
               res.status(200).send({artist});


           }

       }


     });


}

function getArtists(req, res){
  if(req.params.page){
    var page = req.params.page;

  }else{
    var page = 1;
  }
  
  var itemsPerPage = 3;

  Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
  if(err){
      res.status(500).send({message: 'Error en la peticion'});

  }else{
    if(!artists){
        res.status(404).send({message: 'No hay artistas'});

    }else{
        return res.status(200).send({
            total_items: total,
            artists: artists
        });
     }
    }
  });
}



function saveArtist(req, res){
   var artist = new Artist();

   var params = req.body;

   artist.name = params.name;
   artist.description = params.description;
   artist.image = 'null';
   


   artist.save((err, artistStored) => {
      if(err){
         res.status(500).send({message:  'Error al guardar el artista'});
     }else{
      if(!artistStored){
          res.status(404).send({message: 'El artista no ha sido guardado'});
        }else{
          res.status(200).send({artist: artistStored});
       }
      }
    });
   }
 
function updateArtist(req, res){
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated)=>{
      if (err){
          res.status(500).send({message: 'Error al guardar el artista'});
      }else{
        if(!artistUpdated){
          res.status(404).send({message: 'El artista no ha sido actualizado'});
      }else{
          res.status(200).send({artist: artistUpdated});

      }
    }

  });
}


function deleteArtist(req, res){
    var artistId = req.params.id;
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
           if (err){
               res.status(500).send({message: 'Error al eliminar el album'});
                   }else{
                      if(!albumRemoved){
                           res.status(404).send({message: 'El album no ha sido eliminado'});
                         }else{
                           Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                              if (err){
                                 res.status(500).send({message: 'Error al eliminar la cancion'});
                              }else{
                                if(!songRemoved){
                                  res.status(404).send({message: 'La cancion no ha sido eliminada'});
                               }else{
                                 res.status(200).send({album: albumRemoved});     
                               }    
                            }    
                      });
                  }
             }
          });
        }
 

  function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name = 'No subido..';


    if(req.files){
      var file_path = req.files.image.path;
      
      var file_split = file_path.split('\\');
      var file_name = file_split[2];


      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1];
      
      
      if(file_ext == 'png' || file_ext == 'jpg' || file_ext =='gif'){
         Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {

        if(!artistUpdated){
                res.status(404).send({message: 'El artista no ha podido actualizar el usuario'});
           }else{
                res.status(200).send({user: artistUpdated});
         }   

        });
      
       } else{
         res.status(200).send({message: 'Extensión del archivo no valida'});
       }

       
    }else{
      res.status(200).send({message: 'No ha subido imagen'});
    }
    

}



function getImageFile(req, res){

   var imageFile = req.params.imageFile;
   var path_file = './uploads/artists/'+imageFile;
   
   


  fs.access(path_file, fs.constants.F_OK, (err, imG) =>{
       if(err){
        res.status(500).send({message: 'Error no existe imagen'});       
       
      }else{
        res.sendFile(path.resolve(path_file));
   }



 });


}



module.exports = {

   getArtist,
   saveArtist,
   getArtists,
   updateArtist,
   deleteArtist,
   uploadImage,
   getImageFile
};


