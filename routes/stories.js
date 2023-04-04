const express = require('express')
const router = express.Router()
const { ensureAuth} = require('../middleware/auth')

const Story = require('../models/Story')

//@desc Showw add page
//@Route GET /stories/add
router.get('/add', ensureAuth, (req,res) => {
    res.render('stories/add')
})

//@desc Process add form
//@Route POST /stories
router.post('/', ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

//@desc Showw all stories
//@Route GET /stories/add
router.get('/', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
 
})

//@desc Showw single story
//@Route GET /stories/:id
router.get('/:id', ensureAuth, async (req,res) => {
   try {
    let story = await Story.findById(req.params.id).populate('user').lean()
    if(!story){
        return res.render('errors/404')
    }
    res.render('stories/show',{
        story
    })
   } catch (err) {
    console.error(err)
    res.render('errors/404')
   }
})

//@desc Show edit page
//@route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res) => {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
        
        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit', {
                story,
            })
        }
})


//@desc Showw add page
//@Route GET /stories/add
router.put('/:id', ensureAuth, async (req,res) => {
    let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render('error/404')
    }
    
    if(story.user != req.user.id){
        res.redirect('/stories')
    }else{
        let story = await Story.findOneAndUpdate({_id: req.params.id},req.body, {
            new: true, runValidators: true,})
            res.redirect('/dashboard')
    }

    //@desc Delete page
//@Route Delete /stories/:id
})

router.delete('/:id', ensureAuth, async (req,res) => {
    try {
        await Story.findByIdAndRemove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
       console.error(err) 
       return res.render('errors/500')
    }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('errors/500')
    }
  })

module.exports = router