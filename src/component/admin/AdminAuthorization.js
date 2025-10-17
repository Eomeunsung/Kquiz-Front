import React, {useEffect, useState} from 'react';
import {rolesGet, resourcesGet, resourceRoleMappingGet} from "../../api/admin/AdminApi";
import "./../../css/admin/AdminAuthorization.css"
import ResourceAddModal from "./ResourceAddModal";
import RoleAddModal from "./RoleAddModal";
import MappingModal from "./MappingModal";

function AdminAuthorization(props) {
    const [roles, setRoles] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceRoleMapping, setResourceRoleMapping] = useState([]);
    const [resourceModal, setResourceModal] = useState(false);
    const [roleModal, setRoleModal] = useState(false);
    const [mappingModal, setMappingModal] = useState(false);
    useEffect(() => {
        resourcesGet()
            .then(res=>{
                if(res.data){
                    setResources(res.data);
                }
            })
            .catch(err=>{

            })
    }, [resourceModal]);
    useEffect(() => {
        rolesGet()
            .then(res=>{
                if(res.data){
                    setRoles(res.data);
                }

        }).catch(err=>{

        })
    }, [roleModal]);

    useEffect(() => {
        resourceRoleMappingGet()
            .then(res=>{
                if(res.data){
                    setResourceRoleMapping(res.data);
                }
            })
            .catch(err=>{

            })
    },[mappingModal])
    const handleResourceModal=()=>{
        setResourceModal(!resourceModal);
    }

    const handleRoleModal=()=>{
        setRoleModal(!roleModal);
    }

    const handleMappingModal=()=>{
        setMappingModal(!mappingModal);
    }

    return (
        <div>
            <h2>Authorization Settings</h2>

            {/* 리소스 목록 */}
            <section>
                <h3>Resources 리소스</h3>
                <button className="add-btn" onClick={handleResourceModal}>+ 추가</button>
                {
                    resources.length===0 || !roles ? (
                        <p className="no-roles">권한 목록이 없습니다.</p>
                    ):(
                        <ul className="role-list">
                            {resources.map((resource, index) => (
                                <li key={resource.id || index}>
                                    <strong>{resource.resource}</strong>
                                </li>
                            ))}
                        </ul>
                    )
                }
            </section>

            {/* 권한 목록 */}
            <section>
                <h3>Roles / Permissions 권한</h3>
                <button className="add-btn" onClick={handleRoleModal}>+ 추가</button>
                {
                    roles.length===0 || !roles ? (
                        <p className="no-roles">권한 목록이 없습니다.</p>
                    ):(
                        <ul className="role-list">
                            {roles.map((role, index) => (
                                <li key={role.id || index}>
                                    <strong>{role.role}</strong>
                                    {role.description && <span> — {role.description}</span>}
                                </li>
                            ))}
                        </ul>
                    )
                }
                {/* 예: ADMIN, USER 등 */}
            </section>

            {/* 매핑 설정 */}
            <section>
                <h3>Resource Access Rules 리소스 권한 매핑</h3>
                <button className="add-btn" onClick={handleMappingModal}>+ 추가</button>
                {
                    resourceRoleMapping.length===0 || !roles ? (
                        <p className="no-roles">권한 목록이 없습니다.</p>
                    ):(
                        <ul className="role-list">
                            {resourceRoleMapping.map((mapping, index) => (
                                <li key={mapping.id || index}>
                                    <strong>{mapping.resource.resource}</strong>
                                    {
                                        mapping.roles.length===0 || !mapping.roles ? (
                                            <div></div>
                                        ):(
                                            mapping.roles.map((role, index) => (
                                                <li key={role.id || index}>
                                                    <strong>{role.role}</strong>
                                                </li>
                                            ))
                                        )
                                    }
                                </li>
                            ))}
                        </ul>
                    )
                }
            </section>
            {
                resourceModal ? (
                    <ResourceAddModal close={handleResourceModal}></ResourceAddModal>
                    ):null
            }
            {
                roleModal ? (
                    <RoleAddModal close={handleRoleModal}></RoleAddModal>
                ):null
            }
            {
                mappingModal ? (
                    <MappingModal close={handleMappingModal} mappings={resourceRoleMapping} role={roles} resource={resources}></MappingModal>
                ):null
            }
        </div>
    );
}

export default AdminAuthorization;