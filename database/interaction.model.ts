import {Schema, model, models, Document} from 'mongoose';

export interface IInteraction extends Document {
    user: Schema.Types.ObjectId; // reference to user
    action: string; // type of interaction (like, dislike, comment)
    question: Schema.Types.ObjectId; // reference to question
    answer: Schema.Types.ObjectId; // reference to answer 
    tags: Schema.Types.ObjectId[]; // reference to tags
    createdAt: Date; // timestamp when interaction happened
}

const InteractionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    action: {type: String, required: true},
    question: {type: Schema.Types.ObjectId, ref: 'Question'},
    answer: {type: Schema.Types.ObjectId, ref: 'Answer'},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    createdAt: {type: Date, default: Date.now}

     // timestamp when interaction happened  
     // TODO: consider using Date.now() instead of default value for createdAt field. This will prevent potential bugs when interacting with data before createdAt field is set.
});


const Interaction = models.Interaction || model('Interaction', InteractionSchema);

export default Interaction;