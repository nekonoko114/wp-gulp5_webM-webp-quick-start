<footer class="footer">
    <div class="footer-inner">
        <div class="footer-container">
            <div class="footer-logo">
                <img src="<?php echo get_template_directory_uri();?>/assets/images/logo/G-template-theme-logo-tranparent.png" alt="ロゴ">
            </div>
            <?php
            wp_nav_menu(
                array(
                    'theme_location' => 'footer',
                    'menu_class' => 'footer-item',
                    'menu_id' => 'footer-item',
                    'container' => 'ul',
                    'container_class' => 'footer-lists',
                    'container_id' => 'footer-lists',
                    'depth' => 0,
                )
            );
            ?>
            <div class="footer-sns">
                <a href="#"><img src="#" alt="x" type="images/webp"></a>
                <a href="#"><img src="#" alt="Instagram" type="images/webp"></a>
                <a href="#"><img src="#" alt="Twitter" type="images/webp"></a>
            </div>
        </div>
    </div>
</footer>
<?php wp_footer(); ?>
</body>

</html>