const Product = require('../models/product')
    /*
    const getAllProductsStatic = async(req, res) => {
        // const search = 'ab'
        const products = await Product.find({ price: { $gt: 30 } })
            .sort('price')
            .select('name price')
            // .limit(10)
            // .skip(1)
            // name: { $regex: search, $options: 'i' }
            // });
        res.status(200).json({ products, noHit: products.length })
            // console.log(products, noHit = `No of Items = ${products.length}`)
    }
    */

const getAllProduc = async(req, res) => {
    const { featured, company, name, sort, fealds, numericFilters } = req.query
    const queryObject = {}


    if (featured) {
        queryObject.featured = featured === 'treu' ? true : false
            // لو الكويري موجودة هتديني ترو غير كدا فولس
    }
    if (company) {
        queryObject.company = company
            // لو الكويري موجودة هتديني ترو غير كدا فولس
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }



    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;

        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        console.log(filters)
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value)
                };
            }
        });
    }

    console.log(queryObject)
    let result = Product.find(queryObject)


    if (sort) {
        // products = products.sort()
        // console.log(sort);
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createAt')
    }

    if (fealds) {
        // products = products.sort()
        // console.log(sort);
        const fealdsList = fealds.split(',').join(' ')
            // .split(',') دي عشان وانا بكتب في البوست مان افصل بينهم ب العلامه دي
        result = result.select(fealdsList)
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    // 23
    // 4 7 7 7 2
    const products = await result
    res.status(200).json({ products, noHit: products.length })
        //console.log(products);

}
module.exports = {

    getAllProductsStatic,
    getAllProduc
}
