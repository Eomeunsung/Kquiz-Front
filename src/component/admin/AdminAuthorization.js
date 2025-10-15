import React, {useEffect, useState} from 'react';
import {rolesGet, resourcesGet, resourceRoleMappingGet} from "../../api/admin/AdminApi";

function AdminAuthorization(props) {
    const [roles, setRoles] = useState([]);
    const [resources, setResources] = useState([]);
    useEffect(() => {
        rolesGet()
            .then(res=>{
                setRoles(res.data);
        }).catch(err=>{

        })
        resourcesGet()
            .then(res=>{
                setResources(res.data);
            })
            .catch(err=>{

            })
        resourceRoleMappingGet()
            .then(res=>{

            })
            .catch(err=>{

            })
    }, []);

    return (
        <div>
            <h2>Authorization Settings</h2>

            {/* 리소스 목록 */}
            <section>
                <h3>Resources</h3>
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
                <h3>Roles / Permissions</h3>
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
                <h3>Resource Access Rules</h3>
                {/* 예: ADMIN → /admin 접근 가능 */}
            </section>
        </div>
    );
}

export default AdminAuthorization;