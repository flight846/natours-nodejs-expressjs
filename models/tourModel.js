const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('./userModel')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must not be longer than 40 characters',
            ],
            minlength: [
                10,
                'A tour name must not be shorter than 10 characters',
            ],
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message:
                    'Tour difficulty must be either easy, medium or difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be at least 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (discount) {
                    return value < this.price;
                },
                message:
                    'Price discount of ${VALUE} must be below the regular price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            },
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ],
        slug: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create indexes
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// Virtual Populate reviews instead of embedding
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

// DOCUMENT MIDDLEWARE: Runs before .save() and .create() only
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Embedding sub documents
// tourSchema.pre('save', async function(next) {
//     const guides$ = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guides$); 
//     next();
// })

// QUERY MIDDLEWARE: Filter a field that is not equal true
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: {$ne: true} });
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });

    next();
});



// AGGREGATION MIDDLEWARE: Hide secret tour from aggregation
// tourSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({
//         $match: { secretTour: { $ne: true } }
//     })
//     next();
// });


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;