const { testLogin } = require('./loginTest');
const { testRegistration } = require('./registrationTest');
const { testUserProperty, testDeleteUser } = require('./userTest');
const { testUploadImage } = require('./uploadTest');
const { testSliderChange } = require('./mapTest');

testRegistration().then(() => {
    testLogin().then(() => {
        testUploadImage().then(() => {
            testSliderChange().then(() => {
                    testUserProperty().then(() => {
                        testDeleteUser();
                })
            }) 
        })
    })
})


