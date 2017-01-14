$(document).ready(function(){
	$.validate({
    //lang: 'en',
		modules : 'date, sanitize, security, toggleDisabled',
		disabledFormFilter : 'form.toggle-disabled',
		onModulesLoaded : function() {
			var optionalConfig = {
			  fontSize: '12pt',
			  padding: '4px',
			  bad : 'Very bad',
			  weak : 'Weak',
			  good : 'Good',
			  strong : 'Strong'
			};
			$('input[name="userpassword_confirmation"]').displayPasswordStrength(optionalConfig);
		}
	});
	$('#postDescription').restrictLength( $('#max-length-element') );
});
