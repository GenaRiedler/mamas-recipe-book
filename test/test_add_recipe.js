require('mocha-generators').install();
var Nightmare = require('nightmare');
var expect = require('chai').expect;

// Mocha
describe('Adding to Recipes', function () {

    var nightmare;

    // It runs before each test
    beforeEach(function* () {

        nightmare = Nightmare();

        // Login to the site first
        yield nightmare
            .goto('https://mamas-recipes.herokuapp.com/create')
            .type(".form-control title", "Test_Recipe_Lasagna")
            .type(".form-control description", "Five Cheese Vegetable Lasagna")
            .click(#uploadForm);
        // need to see how to upload a picture in nightmare
        .type("Qty.form-control ingredients", 2)
            .select("unitlist.form-control ingredients", lb)
            .type("Qty.form-control ingredients", 2)
        // need to input ingredients and directions 
        //hit save button
    });

    it('Go to Display all and should be able to view newly added recipe', function (done) {
        nightmare
            .goto('https://mamas-recipes.herokuapp.com/displayAll')
            .evaluate(function () {
                // return document.querySelector(id of newly added recipe?).textContent;
            })
            .end()
            .then(function (recipe ID) {
                // Chai
                expect(recipe ID).to.equal('name of added Recipe')
                done();
            });
    });
    // End the Nightmare instance
    yield nightmare.end();
});