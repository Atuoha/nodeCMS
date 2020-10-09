const moment  = require('moment')

module.exports = {


    select: function(selected, options){
        console.log(options.fn(this))
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"')
    },

    generate_date: function(date, format){
        
        return moment(date).format(format)
    }
}