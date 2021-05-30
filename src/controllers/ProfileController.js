const Profile = require("../model/Profile")

module.exports = {
    index(req, res){
      return res.render("profile", { profile: Profile.get() })
    },
    update(req, res){

      // Receber dados do post
      const data = req.body

      // Quantas semanas tem num ano
      const weeksPerYear = 52

      // Remover as semanas de ferias
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

      // Total de horas por semana
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

      // Total de horas por mês
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

      // Valor da hora
      const valueHour = data["monthly-budget"] / monthlyTotalHours

      Profile.update({
        ...Profile.get(),
        ...req.body,
        "hour-value": valueHour
      })

      return res.redirect('profile')
    }
  }