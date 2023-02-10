<?php

/*
* filename : cau.php
* function : Controller For Authenticated User
* purpose  : all logged user will pass to this controller to determine routes to be
*            access by the user 
*/
class cau extends cbase {
    public function beforeRoute(){
        // var_dump($this->f3->get('SESSION'));
        // die;

           if(empty($this->f3->get('SESSION.logged_in')) || is_null($this->f3->get('SESSION.logged_in'))){

            $this->f3->reroute('/');
           }

        //    var_dump($this->f3->GET('SESSION'));
        //    die;
            // $oRoutes = new user_group_module($this->db);
            // $routeList = $oRoutes->list($this->f3->GET('SESSION.user_group_id'));

            // var_dump($routeList);
            // die;
            // var_dump($routeList);
            // die;
            $access=Access::instance();
            $access->policy('allow'); // allow access to all routes by default
            $access->allow('/loadmenu*');
            $access->allow('/page/*');

            $access->authorize($this->f3->exists('SESSION.user_type') ? $this->f3->get('SESSION.user_type') : 0 );
            $this->f3->SET('SESSION.access', $access);
    }
 }