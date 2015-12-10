function ShowHideContent() {
  var self = this;

  self.escapeElementName = function(str) {
    result = str.replace('[', '\\[').replace(']', '\\]')
    return(result);
  };

  self.showHideRadioToggledContent = function () {
    $(".block-label input[type='radio']").each(function () {

      var $radio = $(this);
      var $radioGroupName = $radio.attr('name');
      var $radioLabel = $radio.parent('label');

      var dataTarget = $radioLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (dataTarget) {

        // Set aria-controls
        $radio.attr('aria-controls', dataTarget);

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $radio.closest('form').find(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {
            var $this = $(this);

            var groupDataTarget = $this.parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.hide();
            // Set aria-expanded and aria-hidden for hidden content
            $this.attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

          var $dataTarget = $('#' + dataTarget);
          $dataTarget.show();
          // Set aria-expanded and aria-hidden for clicked radio
          $radio.attr('aria-expanded', 'true');
          $dataTarget.attr('aria-hidden', 'false');

        });

      } else {
        // If the data-target attribute is undefined for a radio button,
        // hide visible data-target content for radio buttons in the same group

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {

            var groupDataTarget = $(this).parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.hide();
            // Set aria-expanded and aria-hidden for hidden content
            $(this).attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

        });
      }

    });
}
self.showHideCheckboxToggledContent = function () {

  $(".block-label input[type='checkbox']").each(function() {

    var $checkbox = $(this);
    var $checkboxLabel = $(this).parent();

    var $dataTarget = $checkboxLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

        // Set aria-controls
        $checkbox.attr('aria-controls', $dataTarget);

        // Set aria-expanded and aria-hidden
        $checkbox.attr('aria-expanded', 'false');
        $('#'+$dataTarget).attr('aria-hidden', 'true');

        // For checkboxes revealing hidden content
        $checkbox.on('click', function() {

          var state = $(this).attr('aria-expanded') === 'false' ? true : false;

          // Toggle hidden content
          $('#'+$dataTarget).toggle();

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state);
          $('#'+$dataTarget).attr('aria-hidden', !state);

        });
      }

    });
};
}

$(document).ready(function() {

  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  new GOVUK.SelectionButtons($blockLabels);

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  var toggleContent = new ShowHideContent();
  toggleContent.showHideRadioToggledContent();
  toggleContent.showHideCheckboxToggledContent();

  guidance();

});


// Guidance code stolen from Rural payments prototype
function guidance() {


  if ($('.webchat__container').length > 0) {    

    var $doc            = $(document);
    var $window         = $(window);
    var guidanceActive  = false;
    
    var $guidance        = $('.webchat__container');
    var $guidanceOpen    = $('.webchat-open');
    var $guidanceClose   = $('.webchat-close');
    
    var $guidanceMove    = $('.webchat__move-sides');
    
    
    // Open guidance
    
    $guidanceOpen.on('click', function(e) {

      e.preventDefault();
      
      if (guidanceActive === false) {

        $guidance.attr('aria-hidden', false);
        $('body').removeClass('webchat-hidden');
        guidanceActive = true; 
        
      } else {

        $guidance.attr('aria-hidden', true);

        guidanceActive = false;  
        
      }

    });
    
    
    // Close guidance
    
    $guidanceClose.on('click', function(e) {
      console.log('close clicked');
      e.preventDefault();
      
      $guidance.attr('aria-hidden', true);
      $('body').addClass('webchat-hidden');

      setIframeHeight();
      
      guidanceActive = false;        
      
    });
    
    
    // Move guidance
    
    $guidanceMove.on('click', function(e) {


      e.preventDefault();
      
      
      var pos  = $guidance.attr('data-position') === 'right' ? 'left' : 'right';
      var text = $guidance.attr('data-position') === 'right' ? 'Move to the right of the screen' : 'Move to the left of the screen'; 

      $guidance.attr('data-position', pos);
      $('.iframe-container').attr('data-webchat-position', pos);
      $guidanceMove.find('span').text(text);
      $guidanceMove.attr('title', text);
      
      
    });
    
    
    // Close on esc
    
    $doc.on('keyup', function(e) {

      if (e.keyCode === 27 && guidanceActive === true) {

        $guidance.attr('aria-hidden', true);

        guidanceActive = false;
        
      }
      
    });

    $(function(){
      setIframeHeight();
      setMessageBoxHeight();
    });

    //And if the outer div has no set specific height set.. 
    $(window).resize(function(){
      setIframeHeight();
      
      setMessageBoxHeight();

    });

    function setIframeHeight() {
      var height = window.innerHeight,
          footer = ($('.footer-show-webchat').is(":visible")) ? $('.footer-show-webchat').outerHeight() : 0;
          $('iframe').css('height', height-footer);
    };

    function setMessageBoxHeight() {
      var windowHeight = window.innerHeight,
        header = $('.webchat__header').outerHeight(),
        footer = $('.webchat__footer').outerHeight(),
        chatHeight = windowHeight - header - footer;
      // console.log('chatheight is' + chatHeight);
      $('.webchat__content').css('height', chatHeight);
    };
    

  }
  
  
}
