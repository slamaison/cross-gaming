var filterCheckboxes = document.querySelectorAll(".filter_item");

filterCheckboxes.forEach( cb => {
    cb.addEventListener('change', function() {
        
        let showDurationLow = document.querySelector("[name='duration_low']").checked;
        let showDurationMedium = document.querySelector("[name='duration_medium']").checked;
        let showDurationHigh = document.querySelector("[name='duration_high']").checked;

        document.querySelectorAll(".game").forEach(g => {
            g.classList.toggle("hidden",true);
            
            let gMin = parseInt(g.dataset.durationMin);
            let gMax = parseInt(g.dataset.durationMax);

            if(showDurationLow && gMax <= 30)
                g.classList.remove("hidden");
            
            if(showDurationMedium && ((30 < gMin && gMin <= 60) || (30 < gMax && gMax <= 60)))
                g.classList.remove("hidden");
            
            if(showDurationHigh && gMax > 60)
                g.classList.remove("hidden");
        });
    });
});