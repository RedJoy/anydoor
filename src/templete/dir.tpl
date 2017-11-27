<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>{{title}}</title>
	<style type="text/css">
		body {
			margin: 30px;
		}
		a {
			margin-right: 20px;
			display: block;
			font-size: 30px;
			color: #4d555d;
		}
	</style>
</head>
<body>
<!-- use handlebars templete -->
{{#each files}}
	<a href="{{../dir}}/{{this}}">【{{icon}}】{{file}}</a>
{{/each}}
</body>
</html>