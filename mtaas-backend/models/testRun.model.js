const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterSchema=new Schema({
    total:Number,
    passed:Number,
    failed:Number,
    warned:Number,
    errored:Number,
    stopped:Number,
    skipped:Number
});

var deviceMinutesSchema=new Schema({
    total:{type:Number,default:0.0},
    metered:{type:Number,default:0.0},
    unmetered:{type:Number,default:0.0}
})

var artifactSchema=new Schema({
    arn:String,
    name:String,
    type:String,
    extension:String,
    url:String
});

var testSchema=new Schema({
    arn:String,
    name:String,
    created:{type: Date,default: Date.now},
    status:String,
    result:String,
    counters:counterSchema,
    message:String,
    deviceMinutes:deviceMinutesSchema,
    artifacts:[artifactSchema]
});

var suiteSchema=new Schema({
    arn:String,
    name:String,
    created:{type: Date,default: Date.now},
    status:String,
    result:String,
    counters:counterSchema,
    message:String,
    deviceMinutes:deviceMinutesSchema,
    tests:[testSchema]
});

var jobSchema=new Schema({
    arn:String,
    name:String,
    created:{type: Date,default: Date.now},
    status:String,
    result:String,
    counters:counterSchema,
    message:String,
    deviceName:String,
    deviceOS:String,
    deviceMinutes:deviceMinutesSchema,
    suites:[suiteSchema],
});

var runSchema=new Schema({
    userName:String,
    projectName:String,
    arn:String,
    name:String,
    type:String,
    platform:String,
    status:String,
    result:String,
    counters:counterSchema,
    totalJobs:Number,
    deviceMinutes:deviceMinutesSchema,
    jobs:[jobSchema]
});

module.exports = mongoose.model('run', runSchema);