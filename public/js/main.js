$(document).ready(function() {
    $('.delete-article').on('click', (e) => {
      //  e.preventDefault();
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log();
        
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: (response) => {
                alert('Deleting Article');
                window.location.href='/';
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
});