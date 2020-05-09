import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  app.get("/filteredimage", async (req, res) => {
  
    let { image_url: imageUrl } = req.query;

    if (!isUrl(imageUrl)) {
      return res.status(400).send({ error: 'image_url is invalid' })
    }

    try {
      const filteredImage = await filterImageFromURL(imageUrl);
      res.status(200).sendFile(filteredImage, async () => {
        await deleteLocalFiles([filteredImage]);
      });
    } catch (e) {
      res.status(422).send({ error: "Image processing failed" });
    }

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
