package com.ReviveFitness.service;

import com.ReviveFitness.model.Attendance;
import com.ReviveFitness.model.Member;
import com.ReviveFitness.repository.AttendanceRepository;
import com.ReviveFitness.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MemberRepository memberRepository;

    public Attendance createAttendance(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));
        Attendance attendance = new Attendance();
        attendance.setMember(member);
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    public List<Attendance> getAttendanceByMemberId(Long memberId) {
        return attendanceRepository.findByMember_Id(memberId);
    }

    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException("Attendance record with id " + id + " not found.");
        }
        attendanceRepository.deleteById(id);
    }
}
