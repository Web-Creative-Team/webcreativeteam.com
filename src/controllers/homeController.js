const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const transporter = require('../managers/emailManager'); // Adjust the path as needed

router.get('/', async (req, res) => {
    let banners = await bannersManager.getAll();
    // console.log(banners);
    res.render('home', {
        showSectionServices: true,
        banners: banners,
        title: "Създаване и поддръжка на уеб сайтове",
        description: "test"
    });
});

router.get('/contacts', async(req, res)=>{

    let banners = await bannersManager.getAll();
    
    res.render('contactUs', {
        banners: banners,
        title: "Contacts",
        description: "test"
    })
})

router.post('/contacts/send', async (req, res) => {
    const { email, name, phone, message } = req.body;

    const mailOptions = {
        from: email, // Your email address
        to: 'info@webcreativeteam.com', // Where you want to receive the messages
        subject: `From Contact form - new Message from ${name}`,
        html: `<p>You have received a new message from the contact form:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect('/');
        
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send message.');
    }
});


router.get('/404', (req, res) => {
    res.render('404', {
        showSectionServices: false,
        title: "Page not fownd",
        description: "test"
    })
});

module.exports = router;

