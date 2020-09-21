import fs from 'fs'
import mongoose from 'mongoose'
const { Schema } = mongoose

export default (() => {
    //get files with schema values
    let files = fs.readdirSync(__dirname)
    //remove self from array
    files = files.filter(f => f !== 'index.ts')

    const Models = {}

    //create models
    files.map(f => {
        const model = f.replace('.ts', '')
        const data = require(`./${model}`)
        const schema = new Schema(
            data,
            { 
                timestamps: { 
                    createdAt: 'created_at',
                    updatedAt: 'updated_at'
                }
            }
        )

        Models[model] = mongoose.model(model, schema)
    })

    return Models
})()