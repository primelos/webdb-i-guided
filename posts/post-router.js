const express = require('express');

// database access using knex
const knex = require('../data/db-config.js'); // <---renamed from db to knex

const router = express.Router();

router.get('/', (req, res) => {
  //  select  * from posts
  knex.select('*').from('posts').then(posts => {
      res.status(200).json(posts)
  })
  .catch(error => {
      console.log(error);
      res.status(500).json({ errorMess: "error getting the posts"})
  })
});

router.get('/:id', (req, res) => {
    knex.select('*').from('posts')
    .where({ id: req.params.id })
    //.first()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMess: "error getting the posts"})
    })
});

router.post('/', (req, res) => {
    //insert into ()values()
    const postData = req.body
    //please validate before calling the database
    
    // 2nd argument will show a warning on console when using SQL lite
    // its there for when we move to mySQL ir Postgres
    knex('posts')
    .insert(postData, "id") 
    .then(ids => {
        //returns and array of one element, the id of the last record inserted
        const id = ids[0]
        
        return knex('posts')
        .where({id})
        .then(posts => {
            res.status(201).json(posts)
        })
        
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMess: "error getting the posts"})
    })
});

router.put('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body

    knex('post')
    .where({ id })
    .update(changes)
    .then (count => {
        if (count > 0){
        res.status(200).json({ message: `${count} record(s) updated` })
        }else{
            res.status(404).json({ message: 'post not found'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            errorMessage: "error updating the past"
        })
    })
});

router.delete('/:id', (req, res) => {
    knex('posts')
    .where({ id: req.params.id })
    .del() 
    .then(count => {
        res.status(200).json({ message: `${count} record(s) removed`})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ errorMessage: 'error removing the post'})
    })
});

module.exports = router;