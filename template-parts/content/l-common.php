<?php
    // 投稿ページや固定ページの場合のみ表示
    if ( is_front_page() ||  is_single() || is_page()):
        global $post;
        setup_postdata($post);
    ?>
        <div class="l-common">
            <div class="l-common-thumbnail">
                <?php if (has_post_thumbnail()): ?>
                    <?php echo get_the_post_thumbnail(); ?>
                <?php endif; ?>
                <h1 class="l-common-title"><?php echo get_the_title(); ?></h1>
            </div>
        </div>
        <?php wp_reset_postdata(); // 投稿データをリセット 
        ?>
    <?php endif; ?>