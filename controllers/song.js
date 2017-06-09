'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

 var Album = require('../models/album');
 var Artist = require('../models/artist');
 var Song = require('../models/song');


function getSong(req, res){
	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err,song)=>{
		if(err){

			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!song){
				res.status(404).send({message: 'NO existe la cancion'});
			}else{
				res.status(200).send({song});

			}


		}

	});


}





function getSongs(req, res){
	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
		}



	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}

	}).exec(function(err,songs){

	if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songs){
				res.status(404).send({message: 'no hay canciones'});
				}else{
				res.status(200).send({song});
				}
		}
	});

}


function saveSong(req, res){
	var song = new Song();

	var params = req.body;
	song.number = paras.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err,songStored)=>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'Error no se ha guardado'});
				}else{
				res.status(200).send({song: songStored});
				}
		}
	});
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;


	Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
		if(err){
				res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'Error no se ha actualizado'});
				}else{
				res.status(200).send({song: songUpdated});
				}
			}

	});

}


function deleteSong(req,res){
	var songId = req.params.id;

	Song.findByIdAndRemove(songId,(err,songRemoved)=>{

	if(err){
				res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'Error no se ha borrado'});
				}else{
				res.status(200).send({song: songRemoved});
				}
			}

	});


}


function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido..';


    if(req.files){
      var file_path = req.files.file.path;
      
      var file_split = file_path.split('\\');
      var file_name = file_split[2];


      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1];
      
   
      if(file_ext == 'mp3' || file_ext == 'ogg'){
         Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {

        if(!songUpdated){
                res.status(404).send({message: 'La cancion no ha podido actualizar'});
           }else{
                res.status(200).send({song: songUpdated});
         }   

        });
      
       } else{
         res.status(200).send({message: 'Extensión del archivo no valida'});
       }

       
    }else{
      res.status(200).send({message: 'No ha subido cancion'});
    }
    

}



function getSongFile(req, res){

   var songFile = req.params.songFile;
   var path_file = './uploads/songs/'+songFile;
   
   


  fs.access(path_file, fs.constants.F_OK, (err, imG) =>{
       if(err){
        res.status(500).send({message: 'Error no existe cancion'});       
       
      }else{
        res.sendFile(path.resolve(path_file));
   }



 });


}


module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile



};