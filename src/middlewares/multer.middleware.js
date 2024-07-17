import multer from "multer";//11.1

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/temp')
    },
    filename: function (req,file,cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round
        // (Math.random() * 1E9)
        cb(null, file.originalname)
    }
})//1.2

export const upload = multer({ storage, })//1.3