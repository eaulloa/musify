'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

 var Album = require('../models/album');
 var Artist = require('../models/artist');
 var Song = require('../models/song');

function getAlbum(req, res){
    
    var albumId = req.params.id;
    
    Album.findById(albumId).populte({path: 'artist'}).exec((err, album) =>{
      if(err){

        res.status(500).send({message: 'Error en la petición'});
     }else{
        if(!album){
            res.status(500).send({message: 'No existe el album'});
        }else{
            res.status(200).send({album});
        }

      }

    });
   }



   function saveAlbum(req, res){
      var album = new Album();

      var params = req.body;
      album.title = params.title;
      album.description = params.description;
      album.year = params.year;
      album.image = params.image;
      album.artist = params.artist;

      album.save((err, albumStored) =>{
        if(err){
          res.status(500).send({message: 'Error en el servidor'});

        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se ha guardado'});
           }else{
            res.status(200).send({album: albumStored})

           }
        }

      });
   } 


function getAlbums(req, res){
  var artisId = req.params.artist;

  if(!artisId){
    //sacar todos los albus de la bbdd
    var find = Album.find({}).sort('title');

  }else{
 // sacar los albums de un artista concreto de la bbdd
    var find = Album.findById({artist: artisId}).sort('year');
  }

  find.populte({path: 'artist'}).exec((err, albums)=>{
    if(err){
      res.status(500).send({message: 'Error en la peticion'});
    }else{
      if(!albums){
        res.status(404).send({message: 'No hay albums'});
      }else{

        res.status(200).send({album: albumStored});
      }

    } 

  });


}


function updateAlbum(req, res){

  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
    if(err){
      res.status(500).send({message: 'Error en la peticion'});
    }else{
      if(!albumUpdated){
        res.status(404).send({message: 'No se ha actualizado el albums'});
      }else{
        res.status(200).send({album: albumUpdated});
      }
    }
  });
}

function deleteAlbum(req, res){

    var albumId = req.params.id;

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
                       res.status(200).send({artist: artistRemoved});     
                      }    
                     }    
                  });
               }
             }
          });
        }

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'No subido..';


    if(req.files){
      var file_path = req.files.image.path;
      
      var file_split = file_path.split('\\');
      var file_name = file_split[2];


      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1];
      
     
 
      if(file_ext == 'png' || file_ext == 'jpg' || file_ext =='gif'){
         Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {

        if(!albumUpdated){
                res.status(404).send({message: 'El album no ha podido actualizar'});
           }else{
                res.status(200).send({user: albumUpdated});
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
   var path_file = './uploads/albums/'+imageFile;
   
   


  fs.access(path_file, fs.constants.F_OK, (err, imG) =>{
       if(err){
        res.status(500).send({message: 'Error no existe imagen'});       
       
      }else{
        res.sendFile(path.resolve(path_file));
   }



 });


}





module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile

};