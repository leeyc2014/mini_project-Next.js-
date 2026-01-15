'use client'

import { useState, ChangeEvent, FormEvent } from 'react';

type Member = {
    id: number;
    userid: string;
    username: string;
    role: 'admin' | 'member';
    createdate: string;
}

export default function MembersData() {
    const [data, setData] = useState<Member[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('userid');
    const options = ['UserID', 'UserName', 'CreateDate'];

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchDate(e.target.value);
    };
    const selectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value as 'UserID' | 'UserName' | 'CreateDate');
        setSearchText("");
    };

    const today = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().split("T")[0];
    };

    const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let searchOption = '';
            if (selectedOption === "CreateDate" && searchDate) {
                searchOption = `?createdate=${searchDate}`;
            }
            else if (searchText.trim() !== '') {
                searchOption = `?${selectedOption}=${encodeURIComponent(searchText)}`;
            }

            const res = await fetch(`/api/members${searchOption}`);
            if (!res.ok) {
                throw new Error('Failed to fetch members');
            }
            const jsondata: Member[] = await res.json();
            setData(jsondata);
        }
        catch (error) {
            console.error('Error fetching Data:', error);
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-3xl font-bold p-5'>일반 회원 목록</h1>
            <form onSubmit={formSubmitHandler}>
                <label>
                    <select id="searchType" value={selectedOption} onChange={selectChange} className="border px-2 m-2">
                        {options.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {selectedOption === 'CreateDate'
                        ? <input type='date' value={searchDate} onChange={handleDateChange} max={today()} className="border px-2 m-2" />
                        : <input type='text' value={searchText} onChange={handleTextChange} placeholder="검색어 입력" className="border px-2 m-2" />
                    }
                </label>
                <button type="submit" className='m-5 bg-gray-200 rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-gray-400 cursor-pointer'>Search</button>
            </form>
            <div>
                <table className='border border-gray-400 border-collapse mx-auto'>
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-2">UserID</th>
                            <th className="border border-gray-400 px-2">UserName</th>
                            <th className="border border-gray-400 px-2">Role</th>
                            <th className="border border-gray-400 px-2">CreateDate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(members => (
                            <tr key={members.id}>
                                <td className="border border-gray-400 px-2">{members.userid}</td>
                                <td className="border border-gray-400 px-2">{members.username}</td>
                                <td className="border border-gray-400 px-2">{members.role}</td>
                                <td className="border border-gray-400 px-2">{new Date(members.createdate).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}