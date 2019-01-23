<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;
use Grav\Common\Uri;
use Grav\Common\Page\Types;
use RocketTheme\Toolbox\Event\Event;

/**
 * Class PasswordGeneratorPlugin
 * @package Grav\Plugin
 */
class PasswordGeneratorPlugin extends Plugin
{
    /**
     * @return array
     *
     * The getSubscribedEvents() gives the core a list of events
     *     that the plugin wants to listen to. The key of each
     *     array section is the event that the plugin listens to
     *     and the value (in the form of an array) contains the
     *     callable (or function) as well as the priority. The
     *     higher the number the higher the priority.
     */
    public static function getSubscribedEvents()
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0],
            'onGetPageTemplates' => ['onGetPageTemplates', 0],
        ];
    }

    /**
     * Add page template types. (for Admin plugin)
     */
    public function onGetPageTemplates(Event $event)
    {
        /** @var Types $types */
        $types = $event->types;
        $types->scanTemplates('plugins://passwordgenerator/templates');
    }

    /**
     * Initialize the plugin
     */
    public function onPluginsInitialized()
    {
        // Don't proceed if we are in the admin plugin
        if ($this->isAdmin()) {
            return;
        }

        // Enable the main event we are interested in
        $this->enable([
            'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
            'onTwigSiteVariables' => ['onTwigSiteVariables', 0],
        ]);
    }

    /**
     * Add current directory to twig lookup paths.
     */
    public function onTwigTemplatePaths()
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
    }

    /**
     * Inject CSS style files and JS scripts files in assets
     */
    public function onTwigSiteVariables()
    {
        if ($this->config->get('plugins.passwordgenerator.built_in_css')) {
            $this->grav['assets']->add('plugin://passwordgenerator/css/passwordgenerator.min.css');
        }
        if ($this->config->get('plugins.passwordgenerator.built_in_js')) {
            $this->grav['assets']->addJs('plugin://passwordgenerator/js/passwordgenerator.min.js', ['group' => 'bottom']);
        }
    }

}
