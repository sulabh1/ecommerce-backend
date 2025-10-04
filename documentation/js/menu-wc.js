'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' : 'data-bs-target="#xs-controllers-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' :
                                            'id="xs-controllers-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' : 'data-bs-target="#xs-injectables-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' :
                                        'id="xs-injectables-links-module-AppModule-12415523ed8cbb81657aeaf1366ef32a2c432d2cbc60cab0025319602403551a3a506098f9b060d7ed7ab722970cd60e2d43c346ef1796a35152ebe17c009b17"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' :
                                            'id="xs-controllers-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' :
                                        'id="xs-injectables-links-module-AuthModule-3d90c3af6c6f42e98a339523c961c773fdb5a370bcfbd62e7157ab310c520e462395a039dbda8644fd51e33d7035d6306a7a1da3f26ee679e82e251f27fd68da"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OtpRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OtpRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OtpService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OtpService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ErrorsModule.html" data-type="entity-link" >ErrorsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ErrorsModule-c04c0f23ea4f96d56dae394e56e2511ea83d4f7360513b693115f610fb5375baae3ef90137e4f3a562cf58c1a6b912bef046c5a4876c6f3a5ad371694b60580d"' : 'data-bs-target="#xs-injectables-links-module-ErrorsModule-c04c0f23ea4f96d56dae394e56e2511ea83d4f7360513b693115f610fb5375baae3ef90137e4f3a562cf58c1a6b912bef046c5a4876c6f3a5ad371694b60580d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ErrorsModule-c04c0f23ea4f96d56dae394e56e2511ea83d4f7360513b693115f610fb5375baae3ef90137e4f3a562cf58c1a6b912bef046c5a4876c6f3a5ad371694b60580d"' :
                                        'id="xs-injectables-links-module-ErrorsModule-c04c0f23ea4f96d56dae394e56e2511ea83d4f7360513b693115f610fb5375baae3ef90137e4f3a562cf58c1a6b912bef046c5a4876c6f3a5ad371694b60580d"' }>
                                        <li class="link">
                                            <a href="injectables/ErrorHandlerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorHandlerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MyMailerModule.html" data-type="entity-link" >MyMailerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MyMailerModule-81661b032483b774c9867252fef364663732260cb51c35eda9d309d2ca8cab8a09f22d40e7d79f5cc907d3709c24f45d9785ef9adee710098c0fe9a0f93d90e7"' : 'data-bs-target="#xs-injectables-links-module-MyMailerModule-81661b032483b774c9867252fef364663732260cb51c35eda9d309d2ca8cab8a09f22d40e7d79f5cc907d3709c24f45d9785ef9adee710098c0fe9a0f93d90e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MyMailerModule-81661b032483b774c9867252fef364663732260cb51c35eda9d309d2ca8cab8a09f22d40e7d79f5cc907d3709c24f45d9785ef9adee710098c0fe9a0f93d90e7"' :
                                        'id="xs-injectables-links-module-MyMailerModule-81661b032483b774c9867252fef364663732260cb51c35eda9d309d2ca8cab8a09f22d40e7d79f5cc907d3709c24f45d9785ef9adee710098c0fe9a0f93d90e7"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TemplatePlaygroundModule.html" data-type="entity-link" >TemplatePlaygroundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' : 'data-bs-target="#xs-components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' :
                                            'id="xs-components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                            <li class="link">
                                                <a href="components/TemplatePlaygroundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplatePlaygroundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' : 'data-bs-target="#xs-injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' :
                                        'id="xs-injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                        <li class="link">
                                            <a href="injectables/HbsRenderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HbsRenderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TemplateEditorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateEditorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ZipExportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ZipExportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' :
                                            'id="xs-controllers-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' :
                                        'id="xs-injectables-links-module-UsersModule-31f5b85fa42b736770e2fcd94661fb76414bb277f1c4697b99a3e9393d348314cf7a43725c4fa837b9efdc47aba727ee4e9df8956df4f8964f98072a384dacdf"' }>
                                        <li class="link">
                                            <a href="injectables/UserRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Otp.html" data-type="entity-link" >Otp</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddEmailVerification1758794208948.html" data-type="entity-link" >AddEmailVerification1758794208948</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddOtpForeignKey1758745851584.html" data-type="entity-link" >AddOtpForeignKey1758745851584</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppError.html" data-type="entity-link" >AppError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppHttpException.html" data-type="entity-link" >AppHttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthenticationError.html" data-type="entity-link" >AuthenticationError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthException.html" data-type="entity-link" >AuthException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorizationError.html" data-type="entity-link" >AuthorizationError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResponseDto.html" data-type="entity-link" >AuthResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link" >BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConflictError.html" data-type="entity-link" >ConflictError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserTable1758745851583.html" data-type="entity-link" >CreateUserTable1758745851583</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseError.html" data-type="entity-link" >DatabaseError</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseException.html" data-type="entity-link" >DatabaseException</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailError.html" data-type="entity-link" >EmailError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailException.html" data-type="entity-link" >EmailException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GlobalExceptionFilter.html" data-type="entity-link" >GlobalExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotFoundError.html" data-type="entity-link" >NotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedResponseDto.html" data-type="entity-link" >PaginatedResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationDto.html" data-type="entity-link" >PaginationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessHandlers.html" data-type="entity-link" >ProcessHandlers</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResendOtpDto.html" data-type="entity-link" >ResendOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignupDto.html" data-type="entity-link" >SignupDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponseDto.html" data-type="entity-link" >UserResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationError.html" data-type="entity-link" >ValidationError</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyEmailDto.html" data-type="entity-link" >VerifyEmailDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CompoDocConfig.html" data-type="entity-link" >CompoDocConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Session.html" data-type="entity-link" >Session</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Template.html" data-type="entity-link" >Template</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tokens.html" data-type="entity-link" >Tokens</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});