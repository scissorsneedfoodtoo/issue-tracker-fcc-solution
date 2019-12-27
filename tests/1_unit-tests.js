/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

const convertHandler = new ConvertHandler();

suite('Unit Tests', function(){

  suite('Function convertHandler.getNum(input)', function() {

    test('Whole number input', function(done) {
      const input = '32L';
      assert.equal(convertHandler.getNum(input),32);
      done();
    });

    test('Decimal Input', function(done) {
      const input = '1242.663kg';
      assert.equal(convertHandler.getNum(input),1242.663);
      done();
    });

    test('Fractional Input', function(done) {
      const input = '4/2kg';
      assert.equal(convertHandler.getNum(input),2);
      done();
    });

    test('Fractional Input w/ Decimal', function(done) {
      const input = '2424.521/921.67lbs'
      assert.equal(convertHandler.getNum(input),2.63057)
      done();
    });

    // // Still discussing how to handle double fractions
    // test('Invalid Input (double fraction)', function(done) {
    //   let input='13/13/13'
    //   assert.equal(convertHandler.getNum(input),'invalid number')
    //   done();
    // });

    test('No Numerical Input', function(done) {
      assert.equal(convertHandler.getNum('lbs'),1)
      assert.equal(convertHandler.getNum('gal'),1)
      done();
    });

  });

  suite('Function convertHandler.getUnit(input)', function() {

    test('For Each Valid Unit Inputs', function(done) {
      const input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];

      input.forEach(function(ele) {
        assert.equal(convertHandler.getUnit(ele), ele.toLowerCase())
      });
      done();
    });

    test('Unknown Unit Input', function(done) {
      assert.equal(convertHandler.getUnit('124lbss'),'invalid unit')
      assert.equal(convertHandler.getUnit('934kms'),'invalid unit')
      done();
    });

  });

  suite('Function convertHandler.getReturnUnit(initUnit)', function() {

    test('For Each Valid Unit Inputs', function(done) {
      const input = ['gal','l','mi','km','lbs','kg'];
      const expect = ['l','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
      });
      done();
    });

  });

  suite('Function convertHandler.spellOutUnit(unit)', function() {

    test('For Each Valid Unit Inputs', function(done) {
      const input = ['gal','l','mi','km','lbs','kg'];
      const expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];
      input.forEach((ele,i)=>{
        assert.equal(convertHandler.spellOutUnit(ele),expect[i])
      })
      done();
    });

  });

  suite('Function convertHandler.convert(num, unit)', function() {

    test('Gal to L', function(done) {
      const input = [5, 'gal'];
      const expected = 18.9271;

      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });

    test('L to Gal', function(done) {
      const input=[7.65,'L'];
      const expected=2.0209171529636155660813491801416;

      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1)
      done();
    });

    test('Mi to Km', function(done) {
      const input =[784.82,'Mi']
      const expected=1263.0422188;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1)
      done();
    });

    test('Km to Mi', function(done) {
      const input=[0.087193275,'Km'];
      const expected=0.05417952390420917891806579094536;

      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1)
      done();
    });

    test('Lbs to Kg', function(done) {
      const input= [165.82, 'Lbs'];
      const expected=75.21462544;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1)
      done();
    });

    test('Kg to Lbs', function(done) {
      const input=[8756.071683, 'Kg'];
      const expected=19303.849457221467750753981551703;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1)
      done();
    });

  });

});
