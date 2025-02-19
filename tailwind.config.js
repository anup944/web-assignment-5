module.exports = {
  content: [
    "./views/**/*.html",
    "./public/**/*.html",
    "./public/js/**/*.js",
  ],
  theme: {
    extend: {cupcake},
  },
  plugins: [
    require('daisyui'),
  ],
};
